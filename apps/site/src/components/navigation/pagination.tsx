import Link from "next/link";
import styles from "./pagination.module.css";

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hrefForPage: (page: number) => string;
  itemLabel?: string;
  ariaLabel?: string;
};

export function Pagination({
  currentPage,
  pageSize,
  totalCount,
  hrefForPage,
  itemLabel = "items",
  ariaLabel = "Pages",
}: PaginationProps) {
  const firstItem = totalCount ? (currentPage - 1) * pageSize + 1 : 0;
  const lastItem = Math.min(currentPage * pageSize, totalCount);
  const previousDisabled = currentPage <= 1;
  const nextDisabled = lastItem >= totalCount;

  return (
    <nav className={styles.pagination} aria-label={ariaLabel}>
      <p>
        Showing <strong>{firstItem}–{lastItem}</strong> of <strong>{totalCount}</strong> {itemLabel}
      </p>
      <div>
        <Link
          href={hrefForPage(currentPage - 1)}
          scroll={false}
          aria-label="Previous page"
          aria-disabled={previousDisabled}
          tabIndex={previousDisabled ? -1 : 0}
          onClick={(event) => previousDisabled && event.preventDefault()}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3 5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <span>Page {currentPage}</span>
        <Link
          href={hrefForPage(currentPage + 1)}
          scroll={false}
          aria-disabled={nextDisabled}
          tabIndex={nextDisabled ? -1 : 0}
          onClick={(event) => nextDisabled && event.preventDefault()}
        >
          Next
        </Link>
      </div>
    </nav>
  );
}
