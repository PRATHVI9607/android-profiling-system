import adbutils

def list_devices():
    return [d.serial for d in adbutils.adb.device_list() if d.status == "device"]

def run_trace(tool, device, config, thread=""):
    import subprocess
    if tool == "perfetto":
        cmd = f"adb -s {device} shell perfetto --txt -c /data/local/tmp/{config} -o /data/local/tmp/trace.perfetto-trace"
        subprocess.run(cmd, shell=True)
        return {"status": "Perfetto trace started"}
    elif tool == "simpleperf":
        cmd = f"adb -s {device} shell simpleperf record -o /data/local/tmp/simpleperf.data"
        if thread:
            cmd += f" --trace-offcpu --tid {thread}"
        subprocess.run(cmd, shell=True)
        return {"status": "Simpleperf trace started"}
    elif tool == "ebpf":
        cmd = f"adb -s {device} shell run-ebpf-trace-script.sh"
        subprocess.run(cmd, shell=True)
        return {"status": "eBPF trace started"}
    return {"status": "Unknown tool"}

def pull_trace(device, remote_path, tool):
    import subprocess
    if tool == "perfetto":
        local_path = f"traces/{device}_perfetto_trace"
    elif tool == "simpleperf":
        local_path = f"perfs/{device}_simpleperf.data"
    elif tool == "ebpf":
        local_path = f"profiles/{device}_ebpf_profile"
    else:
        local_path = "unknown"
    cmd = f"adb -s {device} pull {remote_path} {local_path}"
    subprocess.run(cmd, shell=True)
    return {"status": "pulled", "local_file": local_path}
