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

    # existing must be a list or tuple; anything else is invalid input.
    if not isinstance(existing, (list, tuple)):
        return False

    # Every entry must be a list/tuple of exactly two exact ints.
    # Read-only check: existing is never sorted, appended to, or altered.
    for entry in existing:
        if not isinstance(entry, (list, tuple)) or len(entry) != 2:
            return False
        if type(entry[0]) is not int or type(entry[1]) is not int:
            return False

    # AC4: reject any overlap; touching at an endpoint is not an overlap.
    # Read-only iteration: existing is never sorted, appended to, or altered.
    for s, e in existing:
        if start < e and s < end:
            return False

    # Every rule passed.
    return True