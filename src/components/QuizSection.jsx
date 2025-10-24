// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
// @ts-ignore;
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';

export function QuizSection({
  selectedQuiz,
  setSelectedQuiz,
  quizAnswer,
  setQuizAnswer,
  showQuizResult,
  setShowQuizResult,
  onAnswer
}) {
  const quizQuestions = [{
    question: '以下哪种垃圾属于厨余垃圾？',
    options: ['塑料瓶', '剩饭剩菜', '废电池', '旧衣服'],
    correct: 1
  }, {
    question: '可回收物应该投放到什么颜色的垃圾桶？',
    options: ['红色', '蓝色', '绿色', '灰色'],
    correct: 1
  }, {
    question: '过期药品属于什么垃圾？',
    options: ['可回收物', '厨余垃圾', '有害垃圾', '其他垃圾'],
    correct: 2
  }];
  const handleQuizAnswer = answer => {
    setQuizAnswer(answer);
    setShowQuizResult(true);
    onAnswer(answer);
  };
  const nextQuestion = () => {
    if (selectedQuiz < quizQuestions.length - 1) {
      setSelectedQuiz(selectedQuiz + 1);
      setQuizAnswer(null);
      setShowQuizResult(false);
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          垃圾分类知识问答
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">{quizQuestions[selectedQuiz].question}</h4>
            <span className="text-sm text-slate-500">
              {selectedQuiz + 1} / {quizQuestions.length}
            </span>
          </div>
          <div className="space-y-2">
            {quizQuestions[selectedQuiz].options.map((option, index) => <Button key={index} variant="outline" className="w-full justify-start text-left" onClick={() => handleQuizAnswer(index)}>
                {String.fromCharCode(65 + index)}. {option}
              </Button>)}
          </div>
          {showQuizResult && <div className={`p-3 rounded-lg ${quizAnswer === quizQuestions[selectedQuiz].correct ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
              {quizAnswer === quizQuestions[selectedQuiz].correct ? <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    回答正确！获得10积分
                  </div>
                  {selectedQuiz < quizQuestions.length - 1 && <Button size="sm" onClick={nextQuestion}>
                      下一题
                    </Button>}
                </div> : <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    回答错误，正确答案是：{String.fromCharCode(65 + quizQuestions[selectedQuiz].correct)}
                  </div>
                  <Button size="sm" onClick={nextQuestion}>
                    下一题
                  </Button>
                </div>}
            </div>}
        </div>
      </CardContent>
    </Card>;
}