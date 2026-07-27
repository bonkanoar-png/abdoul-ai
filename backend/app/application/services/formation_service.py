"""Application service for public formation operations."""

from app.application.dto.formation import FormationDTO
from app.application.use_cases.get_formations import GetFormationsUseCase


class FormationService:
    """Orchestrate formation retrieval and DTO transformation."""

    def __init__(self, get_formations: GetFormationsUseCase) -> None:
        self._get_formations = get_formations

    async def get_public_formations(self) -> tuple[FormationDTO, ...]:
        formations = await self._get_formations.execute()
        return tuple(FormationDTO.from_entity(item) for item in formations)
