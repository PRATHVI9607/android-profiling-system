import os

def list_queries():
    return os.listdir("queries")

def save_query(name, content):
    with open(f"queries/{name}", "w") as f:
        f.write(content)
    return {"status": "saved"}

def delete_query(name):
    os.remove(f"queries/{name}")
    return {"status": "deleted"}
