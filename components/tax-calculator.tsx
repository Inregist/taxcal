"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/utils/formatNumber";
import { Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";

interface IncomeItem {
  id: string;
  description: string;
  amount: number;
  multiplier: number;
}

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  multiplier: number;
  readonly?: boolean;
}

interface TaxRate {
  percent: number;
  incomeMin: number;
  incomeMax: number;
  accumulatedTax: number;
  maxTax: number;
}

const taxRates: TaxRate[] = [
  { percent: 0, incomeMin: 0, incomeMax: 150000, accumulatedTax: 0, maxTax: 0 },
  {
    percent: 5,
    incomeMin: 150000,
    incomeMax: 300000,
    accumulatedTax: 0,
    maxTax: 7500,
  },
  {
    percent: 10,
    incomeMin: 300000,
    incomeMax: 500000,
    accumulatedTax: 7500,
    maxTax: 20000,
  },
  {
    percent: 15,
    incomeMin: 500000,
    incomeMax: 750000,
    accumulatedTax: 27500,
    maxTax: 37500,
  },
  {
    percent: 20,
    incomeMin: 750000,
    incomeMax: 1000000,
    accumulatedTax: 65000,
    maxTax: 50000,
  },
  {
    percent: 25,
    incomeMin: 1000000,
    incomeMax: 2000000,
    accumulatedTax: 115000,
    maxTax: 250000,
  },
  {
    percent: 30,
    incomeMin: 2000000,
    incomeMax: 5000000,
    accumulatedTax: 365000,
    maxTax: 900000,
  },
  {
    percent: 35,
    incomeMin: 5000000,
    incomeMax: Infinity,
    accumulatedTax: 1265000,
    maxTax: -1,
  },
];

export default function TaxCalculator() {
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([
    {
      id: "1",
      description: "เงินเดือนรวมทั้งปี",
      amount: 30000,
      multiplier: 12,
    },
  ]);
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([
    {
      id: "1",
      description: "ค่าลดหย่อนส่วนตัว 60,000 บาท",
      amount: 60000,
      multiplier: 1,
      readonly: true,
    },
    {
      id: "2",
      description: "ค่าใช้จ่าย 50% ของเงินเดือนแต่ไม่เกิน 100,000 บาท",
      amount: 100000,
      multiplier: 1,
    },
  ]);

  const totalIncome = useMemo(() => {
    return incomeItems.reduce(
      (sum, item) => sum + (item.amount || 0) * item.multiplier,
      0
    );
  }, [incomeItems]);

  const totalExpenses = useMemo(() => {
    return expenseItems.reduce(
      (sum, item) => sum + (item.amount || 0) * item.multiplier,
      0
    );
  }, [expenseItems]);

  const { calculatedTax, rate } = useMemo(() => {
    const taxableIncome = totalIncome - totalExpenses;

    const rate = taxRates.reduce((rate, maxRate) => {
      if (taxableIncome > maxRate.incomeMin) {
        return maxRate;
      }
      return rate;
    });

    const tax =
      (taxableIncome - rate.incomeMin) * (rate.percent * 0.01) +
      rate.accumulatedTax;

    return {
      calculatedTax: tax,
      rate,
    };
  }, [totalIncome, totalExpenses]);

  const addIncomeItem = () => {
    setIncomeItems([
      ...incomeItems,
      { id: Date.now().toString(), description: "", amount: 0, multiplier: 1 },
    ]);
  };

  const addExpenseItem = () => {
    setExpenseItems([
      ...expenseItems,
      { id: Date.now().toString(), description: "", amount: 0, multiplier: 1 },
    ]);
  };

  const updateIncomeItem = (
    id: string,
    field: "description" | "amount" | "multiplier",
    value: string | number
  ) => {
    setIncomeItems(
      incomeItems.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "amount" ? Number(value) : value }
          : item
      )
    );
  };

  const updateExpenseItem = (
    id: string,
    field: "description" | "amount" | "multiplier",
    value: string | number
  ) => {
    setExpenseItems(
      expenseItems.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "amount" ? Number(value) : value }
          : item
      )
    );
  };

  const removeIncomeItem = (id: string) => {
    if (incomeItems.length > 1) {
      setIncomeItems(incomeItems.filter((item) => item.id !== id));
    }
  };

  const removeExpenseItem = (id: string) => {
    if (expenseItems.length > 1) {
      setExpenseItems(expenseItems.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">คำนวณภาษี</h1>
        <p className="text-gray-600">คำนวณภาษีเงินได้บุคคลธรรมดา</p>
        <p className="text-gray-600">by: inregist</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {/* Income Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">รายได้</h2>
                <Button
                  variant="link"
                  className="hover:no-underline"
                  size="sm"
                  onClick={addIncomeItem}
                >
                  <Plus className="mr-2 h-4 w-4" /> เพิ่มรายการ
                </Button>
              </div>

              {incomeItems.map((item) => (
                <div
                  key={item.id}
                  className="mb-3 flex flex-col gap-3 sm:flex-row"
                >
                  <div className="flex flex-grow gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="my-auto h-3 w-3"
                      onClick={() => removeIncomeItem(item.id)}
                    >
                      <Trash className="h-3 w-3 text-red-500" />
                    </Button>
                    <Input
                      placeholder="รายได้"
                      value={item.description}
                      onChange={(e) =>
                        updateIncomeItem(item.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-gray-500">฿</span>
                    <Input
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-32 px-2 text-right"
                      value={item.amount || ""}
                      onChange={(e) =>
                        updateIncomeItem(item.id, "amount", e.target.value)
                      }
                    />
                    x
                    <Input
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-12 px-2 text-right"
                      value={item.multiplier || ""}
                      onChange={(e) =>
                        updateIncomeItem(item.id, "multiplier", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="font-medium">รวมรายได้</span>
                <span className="font-bold text-blue-600">
                  {formatNumber(totalIncome, 2)} ฿
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xl font-semibold">
                  ค่าใช้จ่าย/ค่าลดหย่อน
                </div>
                <Button
                  variant="link"
                  className="hover:no-underline"
                  size="sm"
                  onClick={addExpenseItem}
                >
                  <Plus className="mr-2 h-4 w-4" /> เพิ่มรายการ
                </Button>
              </div>

              {expenseItems.map((item) => (
                <div
                  key={item.id}
                  className="mb-3 flex flex-col gap-3 sm:flex-row"
                >
                  <div className="flex flex-grow gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="my-auto h-3 w-3"
                      onClick={() => removeExpenseItem(item.id)}
                    >
                      <Trash className="h-3 w-3 text-red-500" />
                    </Button>
                    <Input
                      placeholder="ค่าใช้จ่าย/ค่าลดหย่อน"
                      value={item.description}
                      onChange={(e) =>
                        updateExpenseItem(
                          item.id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-gray-500">฿</span>
                    <Input
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-32 px-2 text-right"
                      value={item.amount || ""}
                      onChange={(e) =>
                        updateExpenseItem(item.id, "amount", e.target.value)
                      }
                    />
                    x
                    <Input
                      type="number"
                      onWheel={(e) => e.currentTarget.blur()}
                      className="w-12 px-2 text-right"
                      value={item.multiplier || ""}
                      onChange={(e) =>
                        updateExpenseItem(item.id, "multiplier", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="font-medium">รวมค่าใช้จ่าย/ค่าลดหย่อน</span>
                <span className="font-bold text-blue-600">
                  {formatNumber(totalExpenses, 2)} ฿
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {/* Tax Summary */}
          <Card className="sticky top-4 mb-6">
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">สรุปการคำนวณ</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>รวมรายได้</span>
                  <span className="font-semibold text-slate-500">
                    {formatNumber(totalIncome, 2)} ฿
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>หักค่าใช้จ่าย/ค่าลดหย่อน</span>
                  <span className="font-semibold text-slate-500">
                    {formatNumber(-totalExpenses, 2)} ฿
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>รายได้สุทธิ</span>
                  <span className="font-bold">
                    {formatNumber(totalIncome - totalExpenses, 2)} ฿
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>ภาษีที่ต้องชำระ</span>
                  <span className="font-bold text-blue-600">
                    {formatNumber(calculatedTax, 2)} ฿
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>ฐานภาษี</span>
                  <span className="font-bold">
                    {totalIncome > 0 ? formatNumber(rate.percent, 2) : "0.00"}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>ภาษีที่จ่ายจริง</span>
                  <span className="font-bold">
                    {totalIncome > 0
                      ? formatNumber((calculatedTax / totalIncome) * 100, 2)
                      : "0.00"}
                    %
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="mb-3 font-semibold">การคำนวณภาษีแต่ละขั้น</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-right">รายได้สุทธิ</th>
                      <th className="px-2 py-2 text-right">ฐานภาษี (%)</th>
                      <th className="px-2 py-2 text-right">ภาษีที่ต้องจ่าย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxRates.map((rate, index) => (
                      <tr
                        key={index}
                        className={`border-b ${totalIncome - totalExpenses > rate.incomeMin ? "bg-blue-50" : ""}`}
                      >
                        <td className="px-2 py-2 text-right">
                          {formatNumber(rate.incomeMin + 1)}
                          {rate.incomeMax === Infinity
                            ? " ขึ้นไป"
                            : ` - ${formatNumber(rate.incomeMax)}`}
                        </td>
                        <td className="px-2 py-2 text-right">
                          {rate.percent}%
                        </td>
                        <td className="px-2 py-2 text-right font-medium">
                          {totalIncome - totalExpenses >= rate.incomeMin &&
                            formatNumber(
                              Math.min(
                                calculatedTax - rate.accumulatedTax,
                                rate.maxTax >= 0 ? rate.maxTax : Infinity
                              ),
                              2
                            )}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-blue-100 font-bold">
                      <td className="px-2 py-2">รวม</td>
                      <td className="px-2 py-2 text-right"></td>
                      <td className="px-2 py-2 text-right text-blue-600">
                        {formatNumber(calculatedTax, 2)} ฿
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
