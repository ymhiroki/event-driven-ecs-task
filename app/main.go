package main

import "time"

func main() {
	println("Hello, World!")

	println("Processing a very heavy task.....")
	time.Sleep(time.Second * 5)
	println("Done!")
}
