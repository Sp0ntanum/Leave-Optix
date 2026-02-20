from typing import Callable
from fastapi import FastAPI
import logging

logger = logging.getLogger(__name__)


def create_start_app_handler(app: FastAPI) -> Callable:
    async def start_app() -> None:
        logger.info("Starting up Workload360 API...")
        # Initialize connections, caches, etc.
        logger.info("Startup complete")
    
    return start_app


def create_stop_app_handler(app: FastAPI) -> Callable:
    async def stop_app() -> None:
        logger.info("Shutting down Workload360 API...")
        # Close connections, cleanup, etc.
        logger.info("Shutdown complete")
    
    return stop_app
