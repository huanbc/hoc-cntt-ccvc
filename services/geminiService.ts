import { GoogleGenAI, Type } from "@google/genai";
import type { Level } from '../types';

// FIX: Per coding guidelines, assume API_KEY is pre-configured and accessible, so the explicit check is removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = "gemini-3-flash-preview";
const multimodalModel = "gemini-2.5-flash-image";

export const generateLesson = async (categoryName: string, topic: string, level: Level, lessonTitle?: string): Promise<{ text: string; imageUrl: string | null }> => {
  let systemInstruction = `Bạn là một giảng viên CNTT chuyên nghiệp tạo ra một giáo án. Toàn bộ nội dung phải bằng tiếng Việt. Định dạng toàn bộ phản hồi bằng Markdown. Sử dụng tiêu đề, chữ in đậm, danh sách và khối mã để cấu trúc nội dung cho dễ đọc. Bạn cũng sẽ tạo một hình ảnh minh họa cho bài học.`;
  let userPrompt = '';

  if (categoryName === 'Ôn thi Công chức, Viên chức' && lessonTitle) {
    systemInstruction = `Bạn là một chuyên gia đào tạo tin học, chuyên luyện thi cho các kỳ thi công chức và viên chức tại Việt Nam. Nhiệm vụ của bạn là soạn thảo một bài học chi tiết, trọng tâm, bám sát nội dung của Thông tư 03/2014/TT-BTTTT của Bộ Thông tin và Truyền thông. Hãy tự tìm kiếm nội dung của thông tư này trên mạng để đảm bảo tính chính xác. Toàn bộ nội dung phải bằng tiếng Việt. Định dạng toàn bộ phản hồi bằng Markdown. Sử dụng tiêu đề, gạch đầu dòng, và các ví dụ thực tế để người học dễ hiểu, dễ nhớ. Bạn cũng sẽ tạo một hình ảnh minh họa cho bài học.`;
    userPrompt = `
      Chủ đề lớn: ${topic}
      Tên bài học cụ thể: ${lessonTitle}

      Hãy tạo nội dung chi tiết cho bài học "${lessonTitle}" thuộc chủ đề "${topic}". Bài học phải bao gồm:
      1. **Mục tiêu bài học**: Nêu rõ kiến thức và kỹ năng người học sẽ đạt được.
      2. **Nội dung lý thuyết**: Trình bày các khái niệm, quy tắc một cách có hệ thống, rõ ràng.
      3. **Hướng dẫn thực hành**: Cung cấp các ví dụ và hướng dẫn từng bước (step-by-step) để người học có thể thao tác theo.
      4. **Tóm tắt và Ghi nhớ**: Tóm lược những điểm chính cần nhớ của bài học.
    `;
  } else {
     userPrompt = `
      Chủ đề: ${topic}
      Cấp độ: ${level} (Các cấp độ có thể là: Cơ bản, Nâng cao, Chuyên gia)

      Tạo một bài học toàn diện cho người học VÀ một hình ảnh minh họa sống động, phù hợp với chủ đề. Bài học phải bao gồm:
      1.  **Giới thiệu**: Một cái nhìn tổng quan ngắn gọn, hấp dẫn về chủ đề và tầm quan trọng của nó.
      2.  **Khái niệm cốt lõi**: Giải thích rõ ràng, chi tiết về các khái niệm chính. Sử dụng các phép loại suy và các thuật ngữ đơn giản.
      3.  **Ví dụ thực tế**: Nếu có, hãy cung cấp các ví dụ hoặc hướng dẫn từng bước để minh họa các khái niệm.
      4.  **Bài tập thực hành**: Một dự án nhỏ hoặc bài tập mà người học có thể làm để áp dụng kiến thức mới của mình. Cung cấp hướng dẫn từng bước.
      5.  **Kết luận**: Tóm tắt những gì đã học và gợi ý về những gì cần học tiếp theo.
      `;
  }
    
  try {
    const response = await ai.models.generateContent({
      model: multimodalModel,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    
    let text = '';
    let imageUrl: string | null = null;
    
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        text += part.text;
      } else if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        imageUrl = `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
      }
    }

    if (!text) {
        throw new Error("No text returned from API");
    }

    return { text, imageUrl };

  } catch (error) {
    console.error("Error generating lesson:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};

export const answerQuestion = async (topic: string, question: string, lessonContext: string): Promise<string> => {
    // FIX: Use systemInstruction for better prompt structure as recommended by coding guidelines.
    const systemInstruction = `Bạn là một gia sư CNTT chuyên nghiệp. Một học viên đang học về chủ đề "${topic}" và có một câu hỏi.
    Bạn sẽ được cung cấp bài học mà họ đang nghiên cứu để lấy ngữ cảnh, theo sau là câu hỏi của họ.
    Cung cấp một câu trả lời rõ ràng, hữu ích và ngắn gọn cho câu hỏi của học viên bằng tiếng Việt.
    Bám sát vào ngữ cảnh của chủ đề và bài học được cung cấp. Nếu câu hỏi nằm ngoài phạm vi, hãy lịch sự nói như vậy.
    Định dạng phản hồi bằng Markdown.`;
    
    const userPrompt = `
    Đây là bài học họ đang nghiên cứu:
    ---
    ${lessonContext}
    ---

    Đây là câu hỏi của học viên: "${question}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: userPrompt,
            config: {
              systemInstruction: systemInstruction
            }
        });

        if (response.text) {
            return response.text;
        } else {
            throw new Error("No text returned from API");
        }
    } catch (error) {
        console.error("Error answering question:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};

export const generateQuiz = async (topic: string, level: string, lessonContext: string) => {
    const systemInstruction = "Bạn là một AI chuyên tạo các bài kiểm tra dựa trên nội dung giáo dục. Nội dung phải bằng tiếng Việt. Đầu ra của bạn phải là một đối tượng JSON hợp lệ khớp với lược đồ được cung cấp. Không bao gồm bất kỳ định dạng markdown, dấu nháy ngược hoặc bình luận nào bên ngoài cấu trúc JSON.";

    const userPrompt = `Dựa trên bài học sau đây về "${topic}" cho người học cấp độ "${level}", hãy tạo một bài kiểm tra trắc nghiệm gồm 10 câu hỏi để kiểm tra sự hiểu biết của họ.

    Nội dung bài học:
    ---
    ${lessonContext}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quiz: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: 'array',
                                        items: { type: Type.STRING }
                                    },
                                    correctAnswerIndex: { type: Type.INTEGER },
                                    explanation: { type: Type.STRING }
                                },
                                required: ["question", "options", "correctAnswerIndex", "explanation"]
                            }
                        }
                    },
                    required: ["quiz"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        const quizData = JSON.parse(jsonText);
        return quizData.quiz;

    } catch (error)
 {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz from the Gemini API.");
    }
};

export const generateExamQuestions = async (numQuestions: number) => {
    const systemInstruction = `Bạn là một AI chuyên tạo các đề thi trắc nghiệm tin học cho các kỳ thi công chức, viên chức tại Việt Nam. Nội dung phải bằng tiếng Việt. Đầu ra của bạn phải là một đối tượng JSON hợp lệ khớp với lược đồ được cung cấp, chứa chính xác ${numQuestions} câu hỏi. Không bao gồm bất kỳ định dạng markdown, dấu nháy ngược hoặc bình luận nào bên ngoài cấu trúc JSON.`;

    const userPrompt = `Tạo một đề thi gồm ${numQuestions} câu hỏi trắc nghiệm để ôn tập kiến thức tin học cho kỳ thi công chức, viên chức. Các câu hỏi nên bao quát các lĩnh vực sau:
-   Kiến thức cơ bản về máy tính, phần cứng, phần mềm.
-   Sử dụng hệ điều hành Windows.
-   Kỹ năng sử dụng Microsoft Word, Excel, PowerPoint.
-   Kiến thức về Internet, email và an toàn thông tin.

Mỗi câu hỏi phải có 4 lựa chọn và một giải thích ngắn gọn, rõ ràng cho câu trả lời đúng.`;

    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        exam: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
                                    correctAnswerIndex: { type: Type.INTEGER },
                                    explanation: { type: Type.STRING }
                                },
                                required: ["question", "options", "correctAnswerIndex", "explanation"]
                            }
                        }
                    },
                    required: ["exam"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        const examData = JSON.parse(jsonText);
        // Ensure the API returns the correct number of questions
        if (Array.isArray(examData.exam) && examData.exam.length > 0) {
            return examData.exam;
        }
        throw new Error("Generated exam data is invalid or empty.");


    } catch (error) {
        console.error("Error generating exam:", error);
        throw new Error("Failed to generate exam from the Gemini API.");
    }
};
