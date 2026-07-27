"""Portfolio domain exceptions."""


class DomainException(Exception):
    """Base class for expected business-rule violations."""


class InvalidPortfolio(DomainException):
    """Raised when required public portfolio data is missing."""


class InvalidExperiencePeriod(DomainException):
    """Raised when an experience period is inconsistent."""


class InvalidProject(DomainException):
    """Raised when a project has invalid required data."""


class InvalidSkill(DomainException):
    """Raised when a skill has invalid required data."""


class InvalidTechnology(DomainException):
    """Raised when a technology has invalid required data."""


class InvalidPublication(DomainException):
    """Raised when a publication has invalid public data."""


class InvalidCertification(DomainException):
    """Raised when a certification has invalid public data."""


class InvalidFormation(DomainException):
    """Raised when a formation has invalid public data."""
