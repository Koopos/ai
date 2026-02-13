import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/Card";

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">家庭日常管理</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>待办事项</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">您有 0 个待办事项</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>今日事件</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">今天有 0 个事件</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>备忘录</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">您有 0 个备忘录</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
