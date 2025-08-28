'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Action = 'topup' | 'withdraw' | 'transfer';

export default function ActionCard({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: Action;
}) {
  const handleClick = () => {
    const event = new CustomEvent('open-dialog', { detail: action });
    window.dispatchEvent(event);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={handleClick}>
          Thực hiện
        </Button>
      </CardContent>
    </Card>
  );
}
