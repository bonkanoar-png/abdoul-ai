"""Use case for obtaining public formations."""

from app.domain.entities.formation import Formation
from app.domain.repositories.formation import FormationRepository


class GetFormationsUseCase:
    """Retrieve formations through their repository contract."""

    def __init__(self, repository: FormationRepository) -> None:
        self._repository = repository

    async def execute(self) -> tuple[Formation, ...]:
        return await self._repository.get_formations()
