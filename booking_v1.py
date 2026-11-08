# booking.py
# Room availability checker using only the standard library.


def can_book(start, end, now, blocked, existing) -> bool:
    """Return True only if the booking request is valid and conflict-free."""

    # Type guard: exact int only (rejects bool, float, None, str). Never raises.
    if type(start) is not int or type(end) is not int or type(now) is not int:
        return False

    # AC1: valid range 0 <= start < end <= 1440.
    if not (0 <= start < end <= 1440):
        return False

    # AC1: start must be strictly after now.
    if start <= now:
        return False

    # AC2: duration may be at most 120 minutes (exactly 120 is allowed).
    if end - start > 120:
        return False

    # AC3: a blocked room can never be booked.
    if blocked:
        return False

    # AC4: reject any overlap; touching at an endpoint is not an overlap.
    # Read-only iteration: existing is never sorted, appended to, or altered.
    for s, e in existing:
        if start < e and s < end:
            return False

    # Every rule passed.
    return True