# 0a TestCase Generator
import random

# Manual Case
print("0,0 => 0")
print("100,100 => 200")
print("-100,-100 => -200")
print("-100,100 => 0")

# Random Case
for i in range(10):
    a = random.randint(-100, 100)
    b = random.randint(-100, 100)
    print("{},{} => {}".format(a, b, a + b))
