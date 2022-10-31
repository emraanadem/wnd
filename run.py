import subprocess
import threading

subprocess.Popen('node wnd.js', shell = True)
subprocess.Popen('lt --port 3001', shell = True)