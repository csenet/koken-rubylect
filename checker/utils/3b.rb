# Random Case
20.times do |i|
  mat = Array.new(n) { Array.new(n) { rand(1...10) } }
  printf("%d %d => %s\n", n, x, comb(n, x))
end
