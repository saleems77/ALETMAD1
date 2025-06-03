'use client';
import React from "react";
import Table from "@/components/ui/table";
import Badge from "@/components/ui/badge";

const PlanComparisonTable = () => {
  const features = [
    { name: 'الدورات المتاحة', monthly: 'غير محدود', yearly: 'غير محدود' },
    { name: 'الدعم الفني', monthly: '24/7', yearly: 'أولوية 24/7' },
    { name: 'التحديثات', monthly: 'شهرية', yearly: 'فورية' }
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <Table hoverable>
        {/* استخدم Table.Header لإنشاء رأس الجدول */}
        <Table.Header>
          <tr>
            <Table.HeadCell>الميزة</Table.HeadCell>
            <Table.HeadCell className="text-center">شهري</Table.HeadCell>
            <Table.HeadCell className="text-center">سنوي</Table.HeadCell>
          </tr>
        </Table.Header>
        <Table.Body>
          {features.map((feature, index) => (
            <Table.Row key={index}>
              <Table.Cell className="font-medium">{feature.name}</Table.Cell>
              <Table.Cell className="text-center">
                <Badge variant="default" className="mx-auto">
                  {feature.monthly}
                </Badge>
              </Table.Cell>
              <Table.Cell className="text-center">
                <Badge variant="default" className="mx-auto">
                  {feature.yearly}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default PlanComparisonTable;
