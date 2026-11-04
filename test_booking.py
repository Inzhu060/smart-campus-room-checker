# test_booking.py - acceptance tests for can_book (standard library only)
import copy
import unittest

from booking import can_book

NOW = 540
BASE = [(600, 660)]


class TestCanBook(unittest.TestCase):
    # ---- Base cases from the assignment ----
    def test_touching_end_is_available(self):          # AC4
        self.assertTrue(can_book(660, 720, NOW, False, BASE))

    def test_touching_start_is_available(self):        # AC4 (mirror)
        self.assertTrue(can_book(540, 600, 500, False, BASE))

    def test_overlap_is_unavailable(self):             # AC4
        self.assertFalse(can_book(630, 690, NOW, False, BASE))

    def test_blocked_room_is_unavailable(self):        # AC3    
        self.assertFalse(can_book(660, 720, NOW, True, BASE))

    def test_exactly_120_minutes_is_available(self):   # AC2
        self.assertTrue(can_book(720, 840, NOW, False, BASE))

    def test_121_minutes_is_unavailable(self):         # AC2
        self.assertFalse(can_book(720, 841, NOW, False, BASE))

    def test_starts_now_is_unavailable(self):          # AC1
        self.assertFalse(can_book(540, 570, NOW, False, BASE))

    def test_starts_one_minute_after_now_is_available(self):  # AC1
        self.assertTrue(can_book(541, 570, NOW, False, BASE))

    # ---- Reversed times and day bounds (AC1) ----
    def test_reversed_times(self):
        self.assertFalse(can_book(700, 650, NOW, False, BASE))

    def test_zero_length(self):
        self.assertFalse(can_book(700, 700, NOW, False, BASE))

    def test_end_at_1440_is_available(self):
        self.assertTrue(can_book(1380, 1440, NOW, False, BASE))

    def test_120_minutes_ending_at_1440(self):
        self.assertTrue(can_book(1320, 1440, NOW, False, BASE))

    def test_end_after_1440_is_unavailable(self):
        self.assertFalse(can_book(1400, 1441, NOW, False, BASE))

    def test_negative_start_is_unavailable(self):
        self.assertFalse(can_book(-1, 30, -5, False, []))

    # ---- Overlap variants and multiple bookings (AC4) ----
    def test_request_contains_existing(self):
        self.assertFalse(can_book(590, 680, NOW, False, BASE))

    def test_existing_contains_request(self):
        self.assertFalse(can_book(610, 650, NOW, False, BASE))

    def test_identical_interval(self):
        self.assertFalse(can_book(600, 660, NOW, False, BASE))

    def test_empty_existing(self):
        self.assertTrue(can_book(700, 760, NOW, False, []))

    def test_multiple_touching_both_sides(self):
        ex = [(600, 660), (700, 760), (800, 860)]
        self.assertTrue(can_book(660, 700, NOW, False, ex))

    def test_multiple_overlap_first_only(self):
        ex = [(600, 660), (700, 760), (800, 860)]
        self.assertFalse(can_book(610, 620, NOW, False, ex))

    def test_multiple_overlap_last_only(self):
        ex = [(600, 660), (700, 760), (800, 860)]
        self.assertFalse(can_book(820, 850, NOW, False, ex))

    def test_multiple_overlap_two_bookings(self):
        ex = [(600, 660), (700, 760), (800, 860)]
        self.assertFalse(can_book(650, 710, NOW, False, ex))

    # ---- Combined rules ----
    def test_too_long_and_overlapping(self):
        self.assertFalse(can_book(600, 800, NOW, False, BASE))

    # ---- Input validation (type guard) ----
    def test_non_int_inputs_return_false(self):
        for bad in (660.0, None, "660", True):
            with self.subTest(start=bad):
                self.assertFalse(can_book(bad, 720, NOW, False, BASE))

    # ---- Inputs unchanged ----
    def test_inputs_not_modified(self):
        ex = [(700, 760), (600, 660), (600, 660)]
        before = copy.deepcopy(ex)
        can_book(660, 700, NOW, False, ex)
        self.assertEqual(ex, before)

            # ---- Regression tests for Issue 1 (invalid `existing`) ----
    def test_existing_none_returns_false(self):
        self.assertFalse(can_book(660, 720, NOW, False, None))

    def test_existing_malformed_entry_returns_false(self):
        for bad in ([(600,)], [(1, 2, 3)], [("a", "b")], ["ab"]):
            with self.subTest(existing=bad):
                self.assertFalse(can_book(660, 720, NOW, False, bad))

    def test_existing_iterator_is_not_consumed(self):
        it = iter([(0, 10), (500, 600)])
        self.assertFalse(can_book(660, 720, NOW, False, it))
        self.assertEqual(list(it), [(0, 10), (500, 600)])


if __name__ == "__main__":
    unittest.main(verbosity=2)