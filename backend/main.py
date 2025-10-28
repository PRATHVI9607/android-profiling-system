from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

from adb_utils import list_devices, run_trace, pull_trace
from trace_manager import list_traces, delete_trace, handle_sql_query, export_trace
from config_manager import list_configs, save_config, delete_config
from query_manager import list_queries, save_query, delete_query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/devices")
def get_devices():
    return list_devices()

@app.post("/run_trace")
def post_run_trace(tool: str, device: str, config: str, thread: str = ""):
    return run_trace(tool, device, config, thread)

@app.post("/pull_trace")
def post_pull_trace(device: str, remote_path: str, tool: str):
    return pull_trace(device, remote_path, tool)

@app.get("/traces")
def get_traces(tool: str):
    return list_traces(tool)

@app.delete("/traces/{trace_name}")
def api_delete_trace(trace_name: str, tool: str):
    return delete_trace(trace_name, tool)

@app.post("/sql_query")
def sql_query(trace_name: str, query: str, tool: str):
    return handle_sql_query(trace_name, query, tool)

@app.post("/export")
def export(trace_name: str, format: str, tool: str):
    return export_trace(trace_name, format, tool)

@app.get("/download/{filename}")
def download(filename: str, tool: str):
    folder = {"perfetto": "traces", "simpleperf": "perfs", "ebpf": "profiles"}[tool]
    path = f"{folder}/{filename}"
    if not os.path.exists(path):
        return {"status": "not_found"}
    return FileResponse(path)

@app.get("/configs")
def get_configs(tool: str):
    return list_configs(tool)

@app.post("/configs")
def post_config(tool: str, name: str, content: str):
    return save_config(tool, name, content)

@app.delete("/configs/{name}")
def del_config(tool: str, name: str):
    return delete_config(tool, name)

@app.get("/queries")
def get_queries():
    return list_queries()

@app.post("/queries")
def post_query(name: str, content: str):
    return save_query(name, content)

@app.delete("/queries/{name}")
def del_query(name: str):
    return delete_query(name)
