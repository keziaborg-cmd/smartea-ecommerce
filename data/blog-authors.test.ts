import { describe, expect, it } from "vitest";
import { getBlogAuthorBySlug } from "./blog-authors";

describe("autores do blog", () => {
  it("o slug antigo (posts gravados antes do rebrand) aponta pro autor novo", () => {
    expect(getBlogAuthorBySlug("equipe-almara")?.name).toBe("Equipe Almara");
    expect(getBlogAuthorBySlug("equipe-smartea")?.slug).toBe("equipe-almara");
    expect(getBlogAuthorBySlug("outro")).toBeUndefined();
  });
});
