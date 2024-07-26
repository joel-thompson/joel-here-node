export const techPlanPrompt = (inputText: string, requirements: string) =>
  `
Here is a technical plan written in markdown:

${inputText}

Requirements:

${requirements}

Please provide feedback on what could be missing from the document.
`;
