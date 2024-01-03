package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"regexp"
	"sort"
)

type Word struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type Group struct {
	Length int    `json:"length"`
	Words  []Word `json:"words"`
}

func main() {
	inputFilePath := flag.String("input", "", "Path to the input dictionary file")
	outputFilePath := flag.String("output", "", "Path to the output JSON file")
	flag.Parse()

	file, err := os.Open(*inputFilePath)
	if err != nil {
		fmt.Println("File reading error", err)
		return
	}
	defer file.Close()

	data := make(map[string]string)
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&data)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Create a map to group words by their lengths
	groupedWords := make(map[int][]Word)
	for key, value := range data {
		length := len(key)
		if length >= 2 && length <= 8 {
			// Check if the word contains special characters
			match, _ := regexp.MatchString(`[^a-zA-Z0-9]`, key)
			if !match {
				groupedWords[length] = append(groupedWords[length], Word{Key: key, Value: value})
			}
		}
	}

	// Create a slice to group words by their lengths
	var groups []Group
	for length, words := range groupedWords {
		// Sort words by key
		sort.Slice(words, func(i, j int) bool {
			return words[i].Key < words[j].Key
		})

		groups = append(groups, Group{
			Length: length,
			Words:  words,
		})
	}

	// Sort groups by length
	sort.Slice(groups, func(i, j int) bool {
		return groups[i].Length < groups[j].Length
	})

	// Convert the dictionary to JSON and write it to the output file
	jsonData, err := json.MarshalIndent(groupedWords, "", " ")
	if err != nil {
		fmt.Println("Error creating JSON:", err)
		return
	}

	err = os.WriteFile(*outputFilePath, jsonData, 0644)
	if err != nil {
		fmt.Println("Error writing file:", err)
	}
}
