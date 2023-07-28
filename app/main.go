package main

import "time"

func main() {
	println("Hello, World!")

	println("Processing a very heavy task.....")
	for i := 0; i < 100; i++ {
		println(i)
		time.Sleep(time.Second * 5)
	}
	println("Done!")
}
