#!/bin/bash
# Example: Omarchy Notification Skill Usage
# This script demonstrates how to send notifications to Omarchy's mako notification daemon

# Example 1: Basic notification
echo "Sending basic notification..."
notify-send "OpenCode" "Skill created successfully!"

# Example 2: Build success notification
echo "Simulating build process..."
sleep 1
notify-send -a "OpenCode Build" -u normal "Build Complete" "All targets compiled successfully"

# Example 3: Test results notification
echo "Simulating test execution..."
sleep 1
notify-send -a "OpenCode Tests" -u normal "Tests Passed" "45/45 tests passed in 2.3s"

# Example 4: Warning notification
echo "Simulating warning..."
sleep 1
notify-send -a "OpenCode" -u critical "Deprecation Warning" "Node.js version 18 will be unsupported next month"

# Example 5: Timeout example
echo "Sending temporary notification..."
notify-send -t 3000 "Temporary" "This notification disappears after 3 seconds"

echo "Done! Check your notifications."
