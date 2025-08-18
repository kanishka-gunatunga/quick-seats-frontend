import React from "react";

// interface SectionTitleProps {
//   title: string;
// }
//
// const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
//   return (
//     <div className="flex flex-wrap gap-9 self-start ml-16 text-5xl leading-none text-indigo-900 max-md:text-4xl">
//       <h2 className="flex-auto max-md:text-4xl">{title}</h2>
//       <div className="flex shrink-0 self-end mt-8 w-40 h-1 bg-indigo-900 rounded-sm" />
//     </div>
//   );
// };
//
// export default SectionTitle;

interface SectionTitleProps {
    title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({title}) => {
    return (
        <div className="flex items-center gap-4 sm:gap-8 mt-4 text-2xl sm:text-[45px] montserrat font-medium text-[#27337C]">
            <h2>{title}</h2>
            <div className="w-32 sm:w-40 h-0.5 sm:h-1 self-end bg-[#27337C] rounded-sm"/>
        </div>
    );
};

export default SectionTitle;
