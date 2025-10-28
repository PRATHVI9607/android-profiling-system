import os
import pandas as pd
from perfetto.trace_processor import TraceProcessor

def list_traces(tool):
    folder = {"perfetto": "traces", "simpleperf": "perfs", "ebpf": "profiles"}[tool]
    return os.listdir(folder)

def delete_trace(trace_name, tool):
    folder = {"perfetto": "traces", "simpleperf": "perfs", "ebpf": "profiles"}[tool]
    os.remove(f"{folder}/{trace_name}")
    return {"status": "deleted"}

def handle_sql_query(trace_name, query, tool):
    if tool == "perfetto":
        tp = TraceProcessor(f"traces/{trace_name}")
        result = tp.query(query)
        df = result.as_pandas_dataframe()
        return df.to_dict()
    return {}

def export_trace(trace_name, format, tool):
    tp = TraceProcessor(f"traces/{trace_name}")
    df = tp.query("SELECT * FROM slice").as_pandas_dataframe()
    file_path = f"traces/{trace_name}.{format}"
    if format == "csv":
        df.to_csv(file_path, index=False)
    else:
        df.to_csv(file_path, sep="\t", index=False)
    return {"status": "exported", "file_path": file_path}
