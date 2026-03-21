from datasets import load_dataset

# Load dataset from Hugging Face
dataset = load_dataset("hikinegi/Garhwali-Dataset")

# Check structure
print(dataset)

# Print first row
print(dataset["train"][0])