#!/bin/bash

# Function to check and kill a process
check_and_kill_process() {
    local port=$1
    local keyword=$2

    # Check if the process is running on the specified port
    if sudo lsof -i :$port | grep -q "$keyword"; then
        # Get the process ID
        pid=$(sudo lsof -i :$port | grep "$keyword" | awk '{print $2}')
        # Kill the process
        sudo kill $pid
        echo "Process with ID $pid killed on port $port."
    else
        echo "No process running on port $port with '$keyword' command."
    fi
}

# Check and kill process on port 9000
check_and_kill_process 8000 "node"

# Check and kill process on port 8000
