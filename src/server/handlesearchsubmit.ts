import { redirect } from "next/navigation";

export async function handleSubmission(formData:FormData): Promise<void> {
    const input = formData.get("search") as string;
    const trimmedInput = input.trimStart();
    const isValid = isValidUrlWithoutScheme(trimmedInput)

    if(!isValid.isIt) {
        redirect(`https://www.google.com/search?q=${trimmedInput}`)
    } else {
        if (isValid.returnString) {
            redirect(isValid.returnString)
        } else {
            // Handle the case where returnString is undefined
            // For example, you could throw an error or redirect to a default page
            throw new Error("Invalid URL");
        }
    }
}

function isValidUrlWithoutScheme(urlString: string) {
    try {
      new URL(urlString);
      return {isIt: true, returnString: urlString};
    } catch {
      try {
        new URL("http://" + urlString);
        return {isIt: true, returnString: "http://" + urlString};
      } catch {
        return {isIt: false};
      }
    }
  }