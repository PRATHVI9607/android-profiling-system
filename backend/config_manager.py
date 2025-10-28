import os

def list_configs(tool):
    folder = "configs"
    return [f for f in os.listdir(folder) if f.startswith(tool)]

def save_config(tool, name, content):
    with open(f"configs/{tool}_{name}", "w") as f:
        f.write(content)
    return {"status": "saved"}

def delete_config(tool, name):
    os.remove(f"configs/{tool}_{name}")
    return {"status": "deleted"}
