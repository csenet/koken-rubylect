# 0a TestCase Generator

PI = 3.141592653589793

# # Manual Case
# print("0,0 => 0")
# print("100,100 => 200")
# print("-100,-100 => -200")
# print("-100,100 => 0")

# Random Case
10.times do |i|
  r = rand(0.0..5.0)
  h = rand(0.0..10.0)
  print("#{r}, #{h} => #{PI * r * r * h / 3.0}\n")
end
