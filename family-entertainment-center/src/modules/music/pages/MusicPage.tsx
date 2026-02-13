import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/Card";

export function MusicPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">音乐</h1>

      <Card>
        <CardHeader>
          <CardTitle>我的音乐库</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">暂无音乐，开始添加您的第一首歌曲吧！</p>
        </CardContent>
      </Card>
    </div>
  );
}
