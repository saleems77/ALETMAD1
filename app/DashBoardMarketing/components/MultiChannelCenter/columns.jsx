// app/DashBoardWakil/components/MultiChannelCenter/columns.jsx
export const leadsColumns = [
    {
      accessorKey: "name",
      header: "الاسم",
    },
    {
      accessorKey: "email",
      header: "البريد الإلكتروني",
    },
    {
      accessorKey: "stage",
      header: "المرحلة",
    },
    {
      accessorKey: "lastContact",
      header: "آخر تواصل",
      cell: ({ row }) => {
        const date = new Date(row.original.lastContact);
        return date.toLocaleDateString();
      },
    },
  ];