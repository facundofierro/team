#!/bin/bash

# TeamHub Task Manager Script
# Helps manage tasks between pending, doing, and done directories

TASKS_DIR="specs/tasks"
PENDING_DIR="$TASKS_DIR/pending"
DOING_DIR="$TASKS_DIR/doing"
DONE_DIR="$TASKS_DIR/done"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    echo -e "${BLUE}TeamHub Task Manager${NC}"
    echo ""
    echo "Usage: $0 [COMMAND] [TASK_NAME]"
    echo ""
    echo "Commands:"
    echo "  start <task>     - Move task from pending to doing"
    echo "  complete <task>  - Move task from doing to done"
    echo "  pause <task>     - Move task from doing back to pending"
    echo "  list             - List all tasks by status"
    echo "  status           - Show current milestone progress"
    echo "  help             - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start 'A: mcp-tools (3)'"
    echo "  $0 complete 'A: mcp-tools (3)'"
    echo "  $0 list"
}

# Function to find task file
find_task() {
    local task_name="$1"
    local found_file=""

    # Search in all directories
    for dir in "$PENDING_DIR" "$DOING_DIR" "$DONE_DIR"; do
        if [ -d "$dir" ]; then
            found_file=$(find "$dir" -name "*$task_name*" -type f | head -1)
            if [ -n "$found_file" ]; then
                echo "$found_file"
                return 0
            fi
        fi
    done

    return 1
}

# Function to move task
move_task() {
    local task_name="$1"
    local source_dir="$2"
    local target_dir="$3"
    local action="$4"

    # Find the task file
    local task_file=$(find "$source_dir" -name "*$task_name*" -type f | head -1)

    if [ -z "$task_file" ]; then
        echo -e "${RED}Error: Task '$task_name' not found in $source_dir${NC}"
        return 1
    fi

    local filename=$(basename "$task_file")
    local target_file="$target_dir/$filename"

    # Move the file
    if mv "$task_file" "$target_file"; then
        echo -e "${GREEN}✓ Task moved: $filename -> $action${NC}"
        return 0
    else
        echo -e "${RED}Error: Failed to move task${NC}"
        return 1
    fi
}

# Function to start a task
start_task() {
    local task_name="$1"
    echo -e "${BLUE}Starting task: $task_name${NC}"
    move_task "$task_name" "$PENDING_DIR" "$DOING_DIR" "doing"
}

# Function to complete a task
complete_task() {
    local task_name="$1"
    echo -e "${BLUE}Completing task: $task_name${NC}"
    move_task "$task_name" "$DOING_DIR" "$DONE_DIR" "done"
}

# Function to pause a task
pause_task() {
    local task_name="$1"
    echo -e "${BLUE}Pausing task: $task_name${NC}"
    move_task "$task_name" "$DOING_DIR" "$PENDING_DIR" "pending"
}

# Function to list all tasks
list_tasks() {
    echo -e "${BLUE}📋 Pending Tasks:${NC}"
    if [ -d "$PENDING_DIR" ] && [ "$(ls -A "$PENDING_DIR")" ]; then
        ls -1 "$PENDING_DIR" | sort
    else
        echo "  No pending tasks"
    fi

    echo ""
    echo -e "${BLUE}🔄 Doing Tasks:${NC}"
    if [ -d "$DOING_DIR" ] && [ "$(ls -A "$DOING_DIR")" ]; then
        ls -1 "$DOING_DIR" | sort
    else
        echo "  No active tasks"
    fi

    echo ""
    echo -e "${BLUE}✅ Done Tasks:${NC}"
    if [ -d "$DONE_DIR" ] && [ "$(ls -A "$DONE_DIR")" ]; then
        ls -1 "$DONE_DIR" | sort
    else
        echo "  No completed tasks"
    fi
}

# Function to show milestone progress
show_status() {
    echo -e "${BLUE}🎯 TeamHub Development Status${NC}"
    echo ""

    # Count tasks by priority
    local pending_a=$(find "$PENDING_DIR" -name "A:*" 2>/dev/null | wc -l)
    local pending_b=$(find "$PENDING_DIR" -name "B:*" 2>/dev/null | wc -l)
    local pending_c=$(find "$PENDING_DIR" -name "C:*" 2>/dev/null | wc -l)
    local pending_d=$(find "$PENDING_DIR" -name "D:*" 2>/dev/null | wc -l)

    local doing_a=$(find "$DOING_DIR" -name "A:*" 2>/dev/null | wc -l)
    local doing_b=$(find "$DOING_DIR" -name "B:*" 2>/dev/null | wc -l)
    local doing_c=$(find "$DOING_DIR" -name "C:*" 2>/dev/null | wc -l)

    local done_a=$(find "$DONE_DIR" -name "A:*" 2>/dev/null | wc -l)
    local done_b=$(find "$DONE_DIR" -name "B:*" 2>/dev/null | wc -l)
    local done_c=$(find "$DONE_DIR" -name "C:*" 2>/dev/null | wc -l)

    echo -e "${YELLOW}Milestone 1 (Internal Tool Foundation):${NC}"
    echo "  Priority A: $done_a completed, $doing_a in progress, $pending_a pending"

    echo -e "${YELLOW}Milestone 2 (Public Agent Platform):${NC}"
    echo "  Priority B: $done_b completed, $doing_b in progress, $pending_b pending"

    echo -e "${YELLOW}Milestone 3 (Advanced Analytics):${NC}"
    echo "  Priority C: $done_c completed, $doing_c in progress, $pending_c pending"

    echo ""
    echo -e "${YELLOW}Future Enhancements:${NC}"
    echo "  Priority D: $pending_d pending"
}

# Main script logic
case "$1" in
    "start")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Task name required${NC}"
            show_usage
            exit 1
        fi
        start_task "$2"
        ;;
    "complete")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Task name required${NC}"
            show_usage
            exit 1
        fi
        complete_task "$2"
        ;;
    "pause")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Task name required${NC}"
            show_usage
            exit 1
        fi
        pause_task "$2"
        ;;
    "list")
        list_tasks
        ;;
    "status")
        show_status
        ;;
    "help"|"--help"|"-h"|"")
        show_usage
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_usage
        exit 1
        ;;
esac
