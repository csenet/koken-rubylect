def getArea(a, b, f)
  h = 0.01
  sum = 0.0
  x = a
  rev = eval(f)
  while x < b
    x += h
    y = eval(f)
    sum += (rev + y) * h / 2.0
    rev = y
  end
  return sum
end

puts getArea(0.0, 1.0, "Math.sqrt(x**2+1)")
