from booking import can_book

print("D1 existing=5:", end=" ")
try:
    print(can_book(100, 160, 50, False, 5))
except Exception as ex:
    print(type(ex).__name__)

print("D3 iterator:", end=" ")
it = iter([(0, 10), (500, 600)])
print(can_book(100, 160, 50, False, it), "| left in iterator:", list(it))

print("R1 zero-length existing:", can_book(100, 160, 50, False, [(130, 130)]))
print("R2 now=-1:", can_book(0, 60, -1, False, []))
print("R4 blocked=None:", can_book(100, 160, 50, None, []))