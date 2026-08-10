"""
Learning Tracker service.

Consumes Member 1's `market` + `roadmap` output (mapped into
RoadmapItemInput by the caller) and tracks completion deterministically.
No LLM involved anywhere in this file — progress is arithmetic, per the
doc's engineering rule #5 ("normal deterministic operations should be
handled by Python").
"""

import uuid
from typing import Dict, List

from app.schemas.learning import (
    InitializeTrackerRequest,
    LearningTask,
    SkillProgress,
    ToggleTaskRequest,
    TrackerState,
)


class TrackerNotFound(Exception):
    pass


class TaskNotFound(Exception):
    pass


# In-memory store: tracker_id -> List[LearningTask]
# Same caveat as interview_service._SESSIONS: swap for the real DB later,
# this is the only place that needs to change.
_TRACKERS: Dict[str, List[LearningTask]] = {}


def _compute_skills_progress(tasks: List[LearningTask]) -> List[SkillProgress]:
    by_skill: Dict[str, List[LearningTask]] = {}
    for task in tasks:
        by_skill.setdefault(task.skill, []).append(task)

    result = []
    for skill, skill_tasks in by_skill.items():
        completed = sum(1 for t in skill_tasks if t.completed)
        total = len(skill_tasks)
        pct = round(completed / total * 100) if total else 0
        result.append(
            SkillProgress(
                skill=skill,
                completed_tasks=completed,
                total_tasks=total,
                progress_percentage=pct,
            )
        )
    return result


def _compute_overall_progress(tasks: List[LearningTask]) -> int:
    if not tasks:
        return 0
    completed = sum(1 for t in tasks if t.completed)
    return round(completed / len(tasks) * 100)


def _build_state(tracker_id: str, tasks: List[LearningTask]) -> TrackerState:
    return TrackerState(
        tracker_id=tracker_id,
        tasks=tasks,
        skills_progress=_compute_skills_progress(tasks),
        overall_progress=_compute_overall_progress(tasks),
    )


def initialize_tracker(request: InitializeTrackerRequest) -> TrackerState:
    tracker_id = request.user_id or str(uuid.uuid4())
    tasks = [
        LearningTask(
            task_id=str(uuid.uuid4()),
            skill=item.skill,
            title=item.title,
            week=item.week,
            completed=False,
        )
        for item in request.roadmap_items
    ]
    _TRACKERS[tracker_id] = tasks
    return _build_state(tracker_id, tasks)


def get_tracker_state(tracker_id: str) -> TrackerState:
    tasks = _TRACKERS.get(tracker_id)
    if tasks is None:
        raise TrackerNotFound(f"No learning tracker with id {tracker_id}")
    return _build_state(tracker_id, tasks)


def toggle_task(request: ToggleTaskRequest) -> TrackerState:
    tasks = _TRACKERS.get(request.tracker_id)
    if tasks is None:
        raise TrackerNotFound(f"No learning tracker with id {request.tracker_id}")

    for task in tasks:
        if task.task_id == request.task_id:
            task.completed = request.completed
            return _build_state(request.tracker_id, tasks)

    raise TaskNotFound(f"No task with id {request.task_id} in tracker {request.tracker_id}")
