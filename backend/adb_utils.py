import subprocess
import logging

def list_devices():
    """List connected adb devices by running the `adb devices` command via subprocess.

    Returns a list of device serials where the device state is 'device'. On error,
    returns a dict with an "error" key.
    """
    try:
        cmd = "adb devices"
        logging.debug(f"Running cmd: {cmd}")
        # Use shell=True to run the command string as requested; capture output
        proc = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        out = proc.stdout
        logging.info(f"adb devices output:\n{out}")

        devices = []
        for line in out.splitlines():
            line = line.strip()
            if not line or line.lower().startswith("list of devices"):
                continue
            parts = line.split()
            # Expect: <serial> <state> [optional fields]
            if len(parts) >= 2:
                serial, state = parts[0], parts[1]
                if state == "device":
                    devices.append(serial)
        return devices
    except subprocess.CalledProcessError as e:
        logging.error(f"adb command failed: {e}; stderr: {getattr(e, 'stderr', None)}")
        return {"error": str(e)}
    except Exception as e:
        logging.error(f"Error in list_devices: {e}")
        return {"error": str(e)}

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
