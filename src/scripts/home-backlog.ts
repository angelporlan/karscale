const root = document.querySelector<HTMLElement>("[data-blog-backlog]");

if (root) {
  const pageSize = Number(root.dataset.pageSize ?? "6");
  const categoryButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-blog-category-filter]"),
  );
  const subcategoryButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-blog-subcategory-filter]"),
  );
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>("[data-blog-post-card]"),
  );
  const resultsCount = root.querySelector<HTMLElement>(
    "[data-blog-results-count]",
  );
  const paginationSummary = root.querySelector<HTMLElement>(
    "[data-blog-pagination-summary]",
  );
  const pagination = root.querySelector<HTMLElement>("[data-blog-pagination]");
  const pageNumbers = root.querySelector<HTMLElement>(
    "[data-blog-page-numbers]",
  );
  const prevButton = root.querySelector<HTMLButtonElement>(
    "[data-blog-page-prev]",
  );
  const nextButton = root.querySelector<HTMLButtonElement>(
    "[data-blog-page-next]",
  );
  const emptyState = root.querySelector<HTMLElement>("[data-blog-empty-state]");
  const grid = root.querySelector<HTMLElement>("[data-blog-post-grid]");

  const state = {
    category: "all",
    subcategory: "all",
    page: 1,
  };

  const categoryActiveClasses = [
    "border-white/30",
    "bg-white/10",
    "text-white",
  ];
  const categoryInactiveClasses = [
    "border-white/10",
    "bg-transparent",
    "text-gray-500",
  ];
  const subcategoryActiveClasses = [
    "border-white/30",
    "bg-white/10",
    "text-white",
  ];
  const subcategoryInactiveClasses = [
    "border-white/10",
    "bg-transparent",
    "text-gray-500",
  ];

  const toggleClasses = (
    element: HTMLButtonElement,
    active: boolean,
    activeClasses: string[],
    inactiveClasses: string[],
  ) => {
    element.setAttribute("aria-pressed", String(active));
    element.classList.remove(...(active ? inactiveClasses : activeClasses));
    element.classList.add(...(active ? activeClasses : inactiveClasses));
  };

  const getFilteredCards = () =>
    cards.filter((card) => {
      const cardCategory = card.dataset.category ?? "";
      const cardSubcategory = card.dataset.subcategory ?? "";

      if (state.category !== "all" && cardCategory !== state.category) {
        return false;
      }

      if (state.subcategory !== "all" && cardSubcategory !== state.subcategory) {
        return false;
      }

      return true;
    });

  const updateCategoryButtons = () => {
    categoryButtons.forEach((button) => {
      const active = (button.dataset.category ?? "all") === state.category;
      toggleClasses(button, active, categoryActiveClasses, categoryInactiveClasses);
    });
  };

  const updateSubcategoryButtons = () => {
    let visibleSelectionExists = false;

    subcategoryButtons.forEach((button) => {
      const buttonCategory = button.dataset.category ?? "all";
      const buttonSubcategory = button.dataset.subcategory ?? "all";
      const matchesCategory =
        buttonSubcategory === "all" ||
        state.category === "all" ||
        buttonCategory === state.category;

      button.hidden = !matchesCategory;

      if (matchesCategory && buttonSubcategory === state.subcategory) {
        visibleSelectionExists = true;
      }
    });

    if (!visibleSelectionExists) {
      state.subcategory = "all";
    }

    subcategoryButtons.forEach((button) => {
      const active = (button.dataset.subcategory ?? "all") === state.subcategory;
      toggleClasses(
        button,
        active,
        subcategoryActiveClasses,
        subcategoryInactiveClasses,
      );
    });
  };

  const buildPageItems = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pageSet = new Set<number>([1, totalPages]);

    for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
      if (page > 1 && page < totalPages) {
        pageSet.add(page);
      }
    }

    return Array.from(pageSet).sort((a, b) => a - b);
  };

  const renderPagination = (totalPages: number) => {
    if (!pageNumbers || !prevButton || !nextButton || !pagination) {
      return;
    }

    pageNumbers.replaceChildren();

    const pageItems = buildPageItems(state.page, totalPages);
    let previousPage = 0;

    pageItems.forEach((page) => {
      if (previousPage && page - previousPage > 1) {
        const ellipsis = document.createElement("span");
        ellipsis.className = "px-2 text-xs text-gray-500";
        ellipsis.textContent = "...";
        pageNumbers.appendChild(ellipsis);
      }

      const pageButton = document.createElement("button");
      pageButton.type = "button";
      pageButton.dataset.page = String(page);
      pageButton.textContent = String(page).padStart(2, "0");
      pageButton.className =
        "w-10 h-10 flex items-center justify-center border text-xs font-heading tracking-widest transition-colors";

      const isActive = page === state.page;
      pageButton.classList.add(
        isActive ? "border-primary" : "border-transparent",
        isActive ? "text-primary" : "text-gray-500",
        isActive ? "bg-white/5" : "bg-transparent",
        "hover:text-white",
      );

      pageButton.setAttribute("aria-current", isActive ? "page" : "false");
      pageButton.addEventListener("click", () => {
        state.page = page;
        render();
      });

      pageNumbers.appendChild(pageButton);
      previousPage = page;
    });

    prevButton.disabled = state.page <= 1;
    nextButton.disabled = state.page >= totalPages;

    prevButton.onclick = () => {
      if (state.page > 1) {
        state.page -= 1;
        render();
      }
    };

    nextButton.onclick = () => {
      if (state.page < totalPages) {
        state.page += 1;
        render();
      }
    };
  };

  const render = () => {
    updateCategoryButtons();
    updateSubcategoryButtons();

    const filteredCards = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
    state.page = Math.min(state.page, totalPages);

    const startIndex = (state.page - 1) * pageSize;
    const visibleCards = new Set(
      filteredCards.slice(startIndex, startIndex + pageSize),
    );

    cards.forEach((card) => {
      card.hidden = !visibleCards.has(card);
    });

    if (resultsCount) {
      const countLabel = filteredCards.length === 1 ? "POST" : "POSTS";
      resultsCount.textContent = `${filteredCards.length} ${countLabel}`;
    }

    if (paginationSummary) {
      paginationSummary.textContent = `PAGE ${state.page} / ${totalPages}`;
    }

    if (emptyState && grid && pagination) {
      const noResults = filteredCards.length === 0;
      emptyState.hidden = !noResults;
      grid.hidden = noResults;
      pagination.hidden = noResults;
    }

    renderPagination(totalPages);
  };

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category ?? "all";
      state.subcategory = "all";
      state.page = 1;
      render();
    });
  });

  subcategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.hidden) {
        return;
      }

      state.subcategory = button.dataset.subcategory ?? "all";
      state.page = 1;
      render();
    });
  });

  render();
}
