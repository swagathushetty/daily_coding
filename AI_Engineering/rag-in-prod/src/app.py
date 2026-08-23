import sys
from dotenv import load_dotenv

load_dotenv()  # load .env before importing modules that read config

from . import rag  # noqa: E402


# ============================================================================
# CLI:  python -m src.app "your question"
#       python -m src.app --staff "what's our margin on earbuds?"   (TASK 9)
#
# Try these to FEEL the sins before fixing them:
#   "how many days do I have to return an item?"   → should work
#   "what does HTTP 429 mean?"                      → TASK 4: vector misses '429'
#   "what's your margin on earbuds?"               → TASK 9: leaks internal doc!
#   "tell me about the SwiftPod reviews"           → TASK 8: injection may hijack
#   "do you ship to the moon?"                     → TASK 6: should say I don't know
# ============================================================================
def main():
    args = sys.argv[1:]
    audiences = ["public"]
    if args and args[0] == "--staff":
        audiences = ["public", "internal"]
        args = args[1:]
    if not args:
        print('usage: python -m src.app [--staff] "your question"')
        return
    question = " ".join(args)
    result = rag.ask(question, user_audiences=audiences)
    print("\n=== ANSWER ===")
    print(result["answer"])
    print("\n=== RETRIEVED (doc | distance) ===")
    for h in result["hits"]:
        print(f"  {h['doc']:35}  {h['distance']:.3f}  [{h['audience']}]")
    if result["usage"]:
        print(f"\ntokens: {result['usage']}")


if __name__ == "__main__":
    main()
