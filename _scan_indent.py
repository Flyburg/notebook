import re, glob

for f in sorted(glob.glob("*.md")):
    lines = open(f, encoding="utf-8").read().split("\n")
    fence = None
    bad = []
    for i, ln in enumerate(lines, 1):
        stripped = ln.strip()
        if fence:
            if stripped.startswith(fence):
                fence = None
            continue
        if stripped.startswith("```") or stripped.startswith("~~~"):
            fence = "```" if stripped.startswith("```") else "~~~"
            continue
        if not stripped:
            continue
        ind = len(ln) - len(ln.lstrip(" "))
        is_item = bool(re.match(r"[-*]\s", stripped)) or bool(re.match(r"\d+\.\s", stripped))
        if is_item and ind % 4 != 0:
            bad.append((i, ind, stripped[:55]))
    print("=== %s: %d anomalies" % (f, len(bad)))
    for b in bad[:20]:
        print("   line %d ind=%d | %s" % b)
