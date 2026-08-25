export async function generateFeedbackSummary(keyPoints: string, studentName: string, className: string) {
  const apiKey = process.env.MOONSHOT_API_KEY;
  if (!apiKey) {
    throw new Error("MOONSHOT_API_KEY is not configured");
  }

  const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "moonshot-v1-8k",
      messages: [
        {
          role: "system",
          content:
            "你是一位专业的教培机构老师，擅长把课堂要点扩展成给家长的完整、温暖、专业的反馈文案。不要编造不存在的信息，只基于老师提供的要点进行组织和润色。",
        },
        {
          role: "user",
          content: `学生：${studentName}\n班级：${className}\n老师记录的课堂要点：\n${keyPoints}\n\n请根据以上要点，生成一段给家长的课堂反馈（300字以内），包含学习情况、课堂表现、需要家长配合的事项。`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "";
}

export async function generateMistakeVariations(content: string, subject: string, count: number = 2) {
  const apiKey = process.env.MOONSHOT_API_KEY;
  if (!apiKey) {
    throw new Error("MOONSHOT_API_KEY is not configured");
  }

  const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "moonshot-v1-8k",
      messages: [
        {
          role: "system",
          content:
            "你是一位专业的习题老师。请根据学生做错的题目，生成同类变式练习题，用于巩固知识点。不要给出答案和解析，只输出题目。每道题用换行分隔。",
        },
        {
          role: "user",
          content: `学科/知识点：${subject}\n原题：\n${content}\n\n请生成 ${count} 道同类变式题（只输出题目，不输出答案和解析）：`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "";
}

export async function generateLearningPlan(
  studentName: string,
  feedbacks: { keyPoints: string; date: Date }[],
  mistakes: { content: string; subject: string; knowledgeTag: string | null }[]
) {
  const apiKey = process.env.MOONSHOT_API_KEY;
  if (!apiKey) {
    throw new Error("MOONSHOT_API_KEY is not configured");
  }

  const feedbackText = feedbacks
    .map((f) => `- ${f.date.toISOString().split("T")[0]}: ${f.keyPoints}`)
    .join("\n");

  const mistakeText = mistakes
    .map((m) => `- ${m.subject}${m.knowledgeTag ? `（${m.knowledgeTag}）` : ""}: ${m.content}`)
    .join("\n");

  const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "moonshot-v1-8k",
      messages: [
        {
          role: "system",
          content:
            "你是一位专业的学习规划老师。请根据学生的课堂反馈和错题记录，生成一份个性化的阶段学习规划。规划应包含薄弱点分析、具体复习目标、建议练习方向。",
        },
        {
          role: "user",
          content: `学生：${studentName}\n\n近期课堂反馈：\n${feedbackText || "暂无反馈"}\n\n错题记录：\n${mistakeText || "暂无错题"}\n\n请生成一份 2 周内的个性化学习规划（400字以内），包括：\n1. 薄弱知识点总结\n2. 阶段目标\n3. 具体行动建议`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || "";
}
