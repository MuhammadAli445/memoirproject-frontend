from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from db.dependencies import get_db, get_current_user   # ⚠️ path confirm karo
from domain.model import MemoirProject, User
from domain.schemas import ProjectCreate, ProjectUpdate, ProjectCoverUpdate, ProjectOut

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("", response_model=ProjectOut)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = MemoirProject(
        owner_id=current_user.id,
        subject_name=payload.subject_name,
        relationship_to_subject=payload.relationship_to_subject,
        start_date=payload.start_date,
        end_date=payload.end_date,
        onboarding_step=1,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("", response_model=List[ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(MemoirProject).filter(MemoirProject.owner_id == current_user.id).all()


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_owned_project(db, project_id, current_user.id)
    return project


@router.patch("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: UUID,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_owned_project(db, project_id, current_user.id)

    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.patch("/{project_id}/cover", response_model=ProjectOut)
def update_cover(
    project_id: UUID,
    payload: ProjectCoverUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = _get_owned_project(db, project_id, current_user.id)
    project.cover_photo_url = payload.cover_photo_url
    db.commit()
    db.refresh(project)
    return project


def _get_owned_project(db: Session, project_id: UUID, user_id: UUID) -> MemoirProject:
    project = db.query(MemoirProject).filter(
        MemoirProject.id == project_id,
        MemoirProject.owner_id == user_id,
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project