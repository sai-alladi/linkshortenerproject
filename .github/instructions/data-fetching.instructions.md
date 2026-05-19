---
description: This file describes the data fetching strategy for the project.
---
# Data Fetching Guidelines
This document outlines the data fetching strategy for the project, including best practices and recommended approaches for fetching data in a Next.js application.

## 1. Use Server components for Data Fetching
In Next.js, it's recommended to use Server components for data fetching.NEVER use Client components for data fetching.

## 2. Data Fetching Methods
ALLWAYS use the helper functions in the /data directory for data fetching. Never fetch data directly in the components. This helps to keep the components clean and focused on rendering.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions. This ensures consistency and maintainability across the codebase.