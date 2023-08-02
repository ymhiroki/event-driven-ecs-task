package main

import (
	"bytes"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func addTimeStampToFilename(fileName string) string {
	return time.Now().Format("2006-01-02T15:04:05.000Z") + fileName
}

func uploadFileToS3WithTimeStamp(region string, bucketName string, filename string) error {
	sess := session.Must(session.NewSessionWithOptions(
		session.Options{
			SharedConfigState: session.SharedConfigEnable,
		},
	))

	svc := s3.New(sess, &aws.Config{
		Region: aws.String(region),
	})

	params := &s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(addTimeStampToFilename(filename)),
		Body:   bytes.NewReader([]byte("Hello World")),
	}

	_, err := svc.PutObject(params)
	if err != nil {
		return err
	}
	log.Println("Successfully uploaded file to S3")
	return nil
}

func main() {
	println("Hello, World!")

	region := getEnv("REGION", "us-east-1")
	bucketName := getEnv("BUCKET_NAME", "")
	println("REGION:", region, "BUCKET_NAME:", bucketName)

	println("Processing a very heavy task.....")
	err := uploadFileToS3WithTimeStamp(region, bucketName, "start.txt")
	if err != nil {
		println("uploadFileToS3WithTimeStamp (start):", err.Error())
		os.Exit(1)
	}

	// 適当な重い処理 e.g. バッチ集計処理
	for i := 0; i < 10; i++ {
		println(i)
		time.Sleep(time.Second * 5)
	}

	// 集計結果を S3 にアップロードするサンプル
	err = uploadFileToS3WithTimeStamp(region, bucketName, "end.txt")
	if err != nil {
		println("uploadFileToS3WithTimeStamp (end):", err.Error())
		os.Exit(1)
	}

	println("Done!")
}
