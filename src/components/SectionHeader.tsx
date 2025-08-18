import * as React from "react";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <header className="flex items-center mb-10 max-sm:flex-col max-sm:items-start">
      <h2 className="text-5xl font-medium text-indigo-900">{title}</h2>
      <div className="ml-6 w-40 h-1 underline bg-indigo-900 max-sm:mt-2.5" />
    </header>
  );
};

export default SectionHeader;
