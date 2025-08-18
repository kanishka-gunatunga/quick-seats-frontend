interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({currentPage, totalPages, onPageChange}: PaginationProps) => {

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };


    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const pages: (number | string)[] = [];
        let startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Adjust startPage if endPage is at totalPages
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push("...");
            }
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push("...");
            }
            pages.push(totalPages);
        }

        return pages;
    };


    return (
        <nav aria-label="Page navigation example">
            <ul className="flex items-center gap-2 -space-x-px h-10 text-base">
                <li>
                    <button
                        // className="flex items-center justify-center px-4 h-10 leading-tight bg-white border-[#BCBCBC] rounded-md hover:bg-gray-100 hover:text-gray-700"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center px-4 h-10 leading-tight bg-white border border-[#BCBCBC] rounded-md ${
                            currentPage === 1
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-gray-100 hover:text-gray-700"
                        }`}
                        aria-label="Previous"
                    >
                        <span className="sr-only">Previous</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.22 12.7199C8.07931 12.5793 8.00018 12.3887 8 12.1899V11.8099C8.0023 11.6114 8.08112 11.4216 8.22 11.2799L13.36 6.14985C13.4539 6.0552 13.5817 6.00195 13.715 6.00195C13.8483 6.00195 13.9761 6.0552 14.07 6.14985L14.78 6.85985C14.8741 6.95202 14.9271 7.07816 14.9271 7.20985C14.9271 7.34154 14.8741 7.46769 14.78 7.55985L10.33 11.9999L14.78 16.4399C14.8747 16.5337 14.9279 16.6615 14.9279 16.7949C14.9279 16.9282 14.8747 17.056 14.78 17.1499L14.07 17.8499C13.9761 17.9445 13.8483 17.9978 13.715 17.9978C13.5817 17.9978 13.4539 17.9445 13.36 17.8499L8.22 12.7199Z"
                                fill="#BCBCBC"/>
                        </svg>
                    </button>
                </li>

                {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                        <li key={page}>
                            <button
                                onClick={() => handlePageClick(page)}
                                className={`flex items-center justify-center px-4 h-10 leading-tight bg-white border border-[#BCBCBC] rounded-md ${
                                    currentPage === page
                                        ? "bg-[#2D3192] text-gray-700"
                                        : "hover:bg-gray-100 hover:text-gray-700"
                                }`}
                                aria-current={currentPage === page ? "page" : undefined}
                            >
                                {page}
                            </button>
                        </li>
                    ) : (
                        <li key={`ellipsis-${index}`}>
                            <span className="flex items-center justify-center px-4 h-10 text-gray-500">
                                {page}
                            </span>
                        </li>
                    )
                )}

                <li>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center px-4 h-10 leading-tight bg-white border border-[#BCBCBC] rounded-md ${
                            currentPage === totalPages
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-gray-100 hover:text-gray-700"
                        }`}
                        aria-label="Next"
                    >
                        <span className="sr-only">Next</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15.78 12.7199C15.9207 12.5793 15.9998 12.3887 16 12.1899V11.8099C15.9977 11.6114 15.9189 11.4216 15.78 11.2799L10.64 6.14985C10.5461 6.0552 10.4183 6.00195 10.285 6.00195C10.1517 6.00195 10.0239 6.0552 9.93 6.14985L9.22 6.85985C9.12594 6.95202 9.07293 7.07816 9.07293 7.20985C9.07293 7.34154 9.12594 7.46769 9.22 7.55985L13.67 11.9999L9.22 16.4399C9.12534 16.5337 9.0721 16.6615 9.0721 16.7949C9.0721 16.9282 9.12534 17.056 9.22 17.1499L9.93 17.8499C10.0239 17.9445 10.1517 17.9978 10.285 17.9978C10.4183 17.9978 10.5461 17.9445 10.64 17.8499L15.78 12.7199Z"
                                fill="#2D2A70"/>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;