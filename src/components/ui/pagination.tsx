// import * as React from "react"
// import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { ButtonProps, buttonVariants } from "@/components/ui/button"
// interface PaginationProps extends React.ComponentProps<"nav"> {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
//   limit: number;
//   onLimitChange: (limit: number) => void;
// }

// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   limit,
//   onLimitChange,
//   className,
//   ...props
// }: PaginationProps) => {
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//   const limits = [5, 10, 25, 50];

//   return (
//     <nav
//       role="navigation"
//       aria-label="pagination"
//       className={cn("mx-auto flex w-full justify-center flex-col items-center gap-2", className)}
//       {...props}
//     >
//       <div className="flex space-x-2">
//         <PaginationPrevious
//           onClick={() => onPageChange(currentPage - 1)}
//           // disabled={currentPage === 1}
//         />
//         {pages.map((page) => (
//           <PaginationLink
//             key={page}
//             isActive={page === currentPage}
//             onClick={() => onPageChange(page)}
//           >
//             {page}
//           </PaginationLink>
//         ))}
//         <PaginationNext
//           onClick={() => onPageChange(currentPage + 1)}
//           // disabled={currentPage === totalPages}
//         />
//       </div>

//       {/* Limit selector */}
//       <div className="flex items-center space-x-2 mt-2">
//         <label className="text-sm text-gray-600">Items per page:</label>
//         <select
//           value={limit}
//           onChange={(e) => onLimitChange(Number(e.target.value))}
//           className="border border-gray-300 rounded p-1 text-sm"
//         >
//           {limits.map((l) => (
//             <option key={l} value={l}>
//               {l}
//             </option>
//           ))}
//         </select>
//       </div>
//     </nav>
//   );
// };

// Pagination.displayName = "Pagination";


// const PaginationContent = React.forwardRef<
//   HTMLUListElement,
//   React.ComponentProps<"ul">
// >(({ className, ...props }, ref) => (
//   <ul
//     ref={ref}
//     className={cn("flex flex-row items-center gap-1", className)}
//     {...props}
//   />
// ))
// PaginationContent.displayName = "PaginationContent"

// const PaginationItem = React.forwardRef<
//   HTMLLIElement,
//   React.ComponentProps<"li">
// >(({ className, ...props }, ref) => (
//   <li ref={ref} className={cn("", className)} {...props} />
// ))
// PaginationItem.displayName = "PaginationItem"

// type PaginationLinkProps = {
//   isActive?: boolean
// } & Pick<ButtonProps, "size"> &
//   React.ComponentProps<"a">

// const PaginationLink = ({
//   className,
//   isActive,
//   size = "icon",
//   ...props
// }: PaginationLinkProps) => (
//   <a
//     aria-current={isActive ? "page" : undefined}
//     className={cn(
//       buttonVariants({
//         variant: isActive ? "outline" : "ghost",
//         size,
//       }),
//       className
//     )}
//     {...props}
//   />
// )
// PaginationLink.displayName = "PaginationLink"

// const PaginationPrevious = ({
//   className,
//   ...props
// }: React.ComponentProps<typeof PaginationLink>) => (
//   <PaginationLink
//     aria-label="Go to previous page"
//     size="default"
//     className={cn("gap-1 pl-2.5", className)}
//     {...props}
//   >
//     <ChevronLeft className="h-4 w-4" />
//     <span>Previous</span>
//   </PaginationLink>
// )
// PaginationPrevious.displayName = "PaginationPrevious"

// const PaginationNext = ({
//   className,
//   ...props
// }: React.ComponentProps<typeof PaginationLink>) => (
//   <PaginationLink
//     aria-label="Go to next page"
//     size="default"
//     className={cn("gap-1 pr-2.5", className)}
//     {...props}
//   >
//     <span>Next</span>
//     <ChevronRight className="h-4 w-4" />
//   </PaginationLink>
// )
// PaginationNext.displayName = "PaginationNext"

// const PaginationEllipsis = ({
//   className,
//   ...props
// }: React.ComponentProps<"span">) => (
//   <span
//     aria-hidden
//     className={cn("flex h-9 w-9 items-center justify-center", className)}
//     {...props}
//   >
//     <MoreHorizontal className="h-4 w-4" />
//     <span className="sr-only">More pages</span>
//   </span>
// )
// PaginationEllipsis.displayName = "PaginationEllipsis"

// export {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// }
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

interface PaginationProps extends React.ComponentProps<"nav"> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  limit: number
  onLimitChange: (limit: number) => void
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  className,
  ...props
}: PaginationProps) => {
  const safeTotalPages = Math.max(totalPages, 1)
  const limits = [5, 10, 25, 50]

  // --- Ellipsis pagination logic ---
  const getPageNumbers = () => {
    const maxVisible = 5 // how many numbers visible at once
    const pages: (number | string)[] = []

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i++) pages.push(i)
    } else {
      const left = Math.max(1, currentPage - 1)
      const right = Math.min(safeTotalPages, currentPage + 1)

      if (left > 2) {
        pages.push(1, "ellipsis")
      } else {
        for (let i = 1; i < left; i++) pages.push(i)
      }

      for (let i = left; i <= right; i++) pages.push(i)

      if (right < safeTotalPages - 1) {
        pages.push("ellipsis", safeTotalPages)
      } else {
        for (let i = right + 1; i <= safeTotalPages; i++) pages.push(i)
      }
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-between items-center px-4", className)}
      {...props}
    >
      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        <PaginationPrevious
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          aria-disabled={currentPage === 1}
        />
        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationEllipsis key={`ellipsis-${idx}`} />
          ) : (
            <PaginationLink
              key={page}
              isActive={page === currentPage}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </PaginationLink>
          )
        )}
        <PaginationNext
          onClick={() => currentPage < safeTotalPages && onPageChange(currentPage + 1)}
          aria-disabled={currentPage === safeTotalPages}
        />
      </div>

      {/* Items per page selector */}
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-600">Items per page:</label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-gray-300 rounded p-1 text-sm"
        >
          {limits.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </nav>
  )
}

Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
