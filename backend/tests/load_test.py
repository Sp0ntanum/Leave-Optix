"""
Production Load Testing Suite
Simulates real-world production scenarios
"""
import asyncio
import time
import statistics
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict
import requests
from datetime import date, timedelta
import random

BASE_URL = "http://localhost:8000"
API_V1 = f"{BASE_URL}/api/v1"


class LoadTestResult:
    def __init__(self, name: str):
        self.name = name
        self.response_times: List[float] = []
        self.errors: List[str] = []
        self.success_count = 0
        self.failure_count = 0
        self.start_time = None
        self.end_time = None
    
    def add_success(self, response_time: float):
        self.response_times.append(response_time)
        self.success_count += 1
    
    def add_failure(self, error: str):
        self.errors.append(error)
        self.failure_count += 1
    
    def get_stats(self) -> Dict:
        if not self.response_times:
            return {
                "name": self.name,
                "success": 0,
                "failure": self.failure_count,
                "error_rate": 100.0
            }
        
        duration = self.end_time - self.start_time if self.end_time else 0
        
        return {
            "name": self.name,
            "total_requests": self.success_count + self.failure_count,
            "success": self.success_count,
            "failure": self.failure_count,
            "error_rate": (self.failure_count / (self.success_count + self.failure_count)) * 100,
            "response_time_p50": statistics.median(self.response_times),
            "response_time_p95": statistics.quantiles(self.response_times, n=20)[18] if len(self.response_times) > 20 else max(self.response_times),
            "response_time_p99": statistics.quantiles(self.response_times, n=100)[98] if len(self.response_times) > 100 else max(self.response_times),
            "response_time_avg": statistics.mean(self.response_times),
            "response_time_min": min(self.response_times),
            "response_time_max": max(self.response_times),
            "throughput": self.success_count / duration if duration > 0 else 0,
            "duration_seconds": duration
        }


def create_leave_request(token: str, user_id: str) -> tuple:
    """Simulate leave request creation"""
    start = time.time()
    try:
        response = requests.post(
            f"{API_V1}/leaves/",
            json={
                "leave_type": random.choice(["vacation", "sick", "personal"]),
                "start_date": (date.today() + timedelta(days=random.randint(10, 60))).isoformat(),
                "end_date": (date.today() + timedelta(days=random.randint(61, 90))).isoformat(),
                "reason": "Load test request",
                "is_half_day": False,
                "half_day_period": None
            },
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        elapsed = time.time() - start
        return response.status_code in [200, 201], elapsed, response.status_code
    except Exception as e:
        elapsed = time.time() - start
        return False, elapsed, str(e)


def approve_leave(token: str, leave_id: str) -> tuple:
    """Simulate leave approval"""
    start = time.time()
    try:
        response = requests.post(
            f"{API_V1}/approvals/{leave_id}/approve",
            json={
                "status": "approved",
                "comments": "Load test approval"
            },
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        elapsed = time.time() - start
        return response.status_code == 200, elapsed, response.status_code
    except Exception as e:
        elapsed = time.time() - start
        return False, elapsed, str(e)


def get_workload_analysis(token: str, team_id: str) -> tuple:
    """Simulate workload analysis request"""
    start = time.time()
    try:
        response = requests.get(
            f"{API_V1}/workload/team/{team_id}/analysis",
            headers={"Authorization": f"Bearer {token}"},
            timeout=10
        )
        elapsed = time.time() - start
        return response.status_code == 200, elapsed, response.status_code
    except Exception as e:
        elapsed = time.time() - start
        return False, elapsed, str(e)


# Scenario 1: 100 Concurrent Leave Requests
def test_concurrent_leave_requests(tokens: List[str]) -> LoadTestResult:
    """Test 100 concurrent leave requests"""
    result = LoadTestResult("100 Concurrent Leave Requests")
    result.start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=100) as executor:
        futures = [
            executor.submit(create_leave_request, random.choice(tokens), f"user-{i}")
            for i in range(100)
        ]
        
        for future in as_completed(futures):
            success, elapsed, status = future.result()
            if success:
                result.add_success(elapsed)
            else:
                result.add_failure(f"Status: {status}")
    
    result.end_time = time.time()
    return result


# Scenario 2: 20 Managers Approving Simultaneously
def test_concurrent_approvals(manager_tokens: List[str], leave_ids: List[str]) -> LoadTestResult:
    """Test 20 managers approving simultaneously"""
    result = LoadTestResult("20 Concurrent Approvals")
    result.start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = [
            executor.submit(approve_leave, random.choice(manager_tokens), random.choice(leave_ids))
            for _ in range(20)
        ]
        
        for future in as_completed(futures):
            success, elapsed, status = future.result()
            if success:
                result.add_success(elapsed)
            else:
                result.add_failure(f"Status: {status}")
    
    result.end_time = time.time()
    return result


# Scenario 3: 50 Workload Analysis Requests Per Second
def test_workload_analysis_throughput(tokens: List[str], team_ids: List[str], duration: int = 10) -> LoadTestResult:
    """Test 50 workload analysis requests per second"""
    result = LoadTestResult("50 Workload Analysis/sec")
    result.start_time = time.time()
    
    target_rps = 50
    interval = 1.0 / target_rps
    end_time = time.time() + duration
    
    with ThreadPoolExecutor(max_workers=50) as executor:
        while time.time() < end_time:
            future = executor.submit(
                get_workload_analysis,
                random.choice(tokens),
                random.choice(team_ids)
            )
            
            try:
                success, elapsed, status = future.result(timeout=2)
                if success:
                    result.add_success(elapsed)
                else:
                    result.add_failure(f"Status: {status}")
            except Exception as e:
                result.add_failure(str(e))
            
            time.sleep(interval)
    
    result.end_time = time.time()
    return result


# Scenario 4: Redis Disabled (Cache Fallback)
def test_redis_disabled(token: str) -> LoadTestResult:
    """Test behavior when Redis is unavailable"""
    result = LoadTestResult("Redis Disabled Scenario")
    result.start_time = time.time()
    
    # Simulate multiple requests that would normally use cache
    for _ in range(50):
        success, elapsed, status = get_workload_analysis(token, "test-team-id")
        if success:
            result.add_success(elapsed)
        else:
            result.add_failure(f"Status: {status}")
    
    result.end_time = time.time()
    return result


# Scenario 5: Supabase Slow Response
def test_slow_database(token: str) -> LoadTestResult:
    """Test behavior with slow database responses"""
    result = LoadTestResult("Slow Database Response")
    result.start_time = time.time()
    
    # Make requests with longer timeout
    for _ in range(20):
        start = time.time()
        try:
            response = requests.get(
                f"{API_V1}/leaves/",
                headers={"Authorization": f"Bearer {token}"},
                timeout=30  # Longer timeout for slow DB
            )
            elapsed = time.time() - start
            if response.status_code == 200:
                result.add_success(elapsed)
            else:
                result.add_failure(f"Status: {response.status_code}")
        except Exception as e:
            elapsed = time.time() - start
            result.add_failure(str(e))
    
    result.end_time = time.time()
    return result


# Scenario 6: Token Expiration Mid-Request
def test_token_expiration(expired_token: str) -> LoadTestResult:
    """Test behavior with expired tokens"""
    result = LoadTestResult("Token Expiration")
    result.start_time = time.time()
    
    for _ in range(10):
        start = time.time()
        try:
            response = requests.get(
                f"{API_V1}/leaves/",
                headers={"Authorization": f"Bearer {expired_token}"},
                timeout=5
            )
            elapsed = time.time() - start
            if response.status_code == 401:
                result.add_success(elapsed)  # Expected behavior
            else:
                result.add_failure(f"Unexpected status: {response.status_code}")
        except Exception as e:
            elapsed = time.time() - start
            result.add_failure(str(e))
    
    result.end_time = time.time()
    return result


def print_results(results: List[LoadTestResult]):
    """Print formatted test results"""
    print("\n" + "="*80)
    print("PRODUCTION LOAD TEST RESULTS")
    print("="*80 + "\n")
    
    for result in results:
        stats = result.get_stats()
        print(f"\n{stats['name']}")
        print("-" * 80)
        print(f"Total Requests:    {stats.get('total_requests', 0)}")
        print(f"Success:           {stats['success']} ({100 - stats['error_rate']:.1f}%)")
        print(f"Failure:           {stats['failure']} ({stats['error_rate']:.1f}%)")
        
        if stats['success'] > 0:
            print(f"\nResponse Times (ms):")
            print(f"  Min:             {stats['response_time_min']*1000:.2f}")
            print(f"  Avg:             {stats['response_time_avg']*1000:.2f}")
            print(f"  P50:             {stats['response_time_p50']*1000:.2f}")
            print(f"  P95:             {stats['response_time_p95']*1000:.2f}")
            print(f"  P99:             {stats['response_time_p99']*1000:.2f}")
            print(f"  Max:             {stats['response_time_max']*1000:.2f}")
            print(f"\nThroughput:        {stats.get('throughput', 0):.2f} req/s")
            print(f"Duration:          {stats.get('duration_seconds', 0):.2f}s")
        
        if result.errors:
            print(f"\nSample Errors:")
            for error in result.errors[:3]:
                print(f"  - {error}")


if __name__ == "__main__":
    print("Production Load Testing Suite")
    print("Note: Requires running backend and valid test data")
    print("\nThis is a simulation framework. Actual execution requires:")
    print("1. Running backend instance")
    print("2. Valid authentication tokens")
    print("3. Test data setup")
