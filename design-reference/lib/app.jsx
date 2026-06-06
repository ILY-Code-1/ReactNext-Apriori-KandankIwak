/* ===========================================================
   Kandank Iwak — Root App: routing + shared state
   =========================================================== */

const ADMIN_PAGES = ["dashboard", "products", "orders", "transactions", "apriori"];
const LS = "ki_state_v1";

function App() {
  const KI = window.KI;

  const saved = (() => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } })();

  const [route, setRoute] = useState(saved.route || { app: "store", page: "home", params: {} });
  const [cart, setCart] = useState(saved.cart || {});
  const [authed, setAuthed] = useState(saved.authed || false);
  const [params, setParams] = useState(saved.params || { support: KI.DEFAULT_SUPPORT, confidence: KI.DEFAULT_CONFIDENCE });
  const [lastRun, setLastRun] = useState(saved.lastRun || "1 Jun 2026, 09.00");
  const [rules, setRules] = useState(null);
  const [toast, setToast] = useState(null);
  const mainRef = useRef(null);
  const toastTimer = useRef(null);

  // seed rules on first load so the storefront widget works out of the box
  useEffect(() => {
    if (rules === null) {
      const res = KI.apriori(KI.transactions.map((t) => t.items), params.support, params.confidence, 3);
      setRules(res.rules);
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LS, JSON.stringify({ route, cart, authed, params, lastRun }));
  }, [route, cart, authed, params, lastRun]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const go = (page, p = {}, forceApp) => {
    const app = forceApp || (ADMIN_PAGES.includes(page) ? "admin" : "store");
    setRoute({ app, page, params: p });
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const addToCart = (product, qty = 1) => {
    setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + qty }));
    showToast(`${product.name} ditambahkan`);
  };
  const setQty = (id, q) => setCart((c) => ({ ...c, [id]: q }));
  const removeItem = (id) => setCart((c) => { const n = { ...c }; delete n[id]; return n; });
  const placeOrder = () => setCart({});

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const recsFor = (pid) => KI.recommendFor(pid, rules || [], 3);
  const recsForCart = (ids) => KI.recommendForCart(ids, rules || [], 3);

  // ----- render store -----
  const renderStore = () => {
    const { page, params: p } = route;
    let view;
    if (page === "catalog") view = <CatalogPage go={go} onAdd={addToCart} />;
    else if (page === "product") view = <ProductDetailPage go={go} params={p} onAdd={addToCart} recsFor={recsFor} />;
    else if (page === "cart") view = <CartPage go={go} cart={cart} setQty={setQty} removeItem={removeItem} onAdd={addToCart} recsForCart={recsForCart} />;
    else if (page === "checkout") view = <CheckoutPage go={go} cart={cart} placeOrder={placeOrder} />;
    else view = <HomePage go={go} onAdd={addToCart} />;
    return (
      <div className="col" style={{ minHeight: "100vh" }}>
        <StoreHeader go={go} page={page} cartCount={cartCount} onCartClick={() => go("cart")} />
        <div style={{ flex: 1 }}>{view}</div>
        <StoreFooter go={go} />
      </div>
    );
  };

  // ----- render admin -----
  const renderAdmin = () => {
    if (!authed) return <AdminLogin onLogin={() => { setAuthed(true); go("dashboard"); }} onExit={() => go("home", {}, "store")} />;
    const { page } = route;
    let view;
    if (page === "products") view = <ManageProducts toast={showToast} />;
    else if (page === "orders") view = <ManageOrders toast={showToast} />;
    else if (page === "transactions") view = <TransactionsData go={go} />;
    else if (page === "apriori") view = <AprioriPage rules={rules} setRules={setRules} lastRun={lastRun} setLastRun={setLastRun} params={params} setParams={setParams} toast={showToast} go={go} />;
    else view = <Dashboard go={go} />;
    return (
      <AdminShell page={page} go={go} lastRun={lastRun} onExit={() => go("home", {}, "store")}>
        {view}
      </AdminShell>
    );
  };

  const inAdmin = route.app === "admin";

  return (
    <div ref={mainRef}>
      {inAdmin ? renderAdmin() : renderStore()}

      {/* mode switcher */}
      <div className="ki-switch">
        <button className={!inAdmin ? "on" : ""} onClick={() => go(route.app === "store" ? route.page : "home", route.params, "store")}>
          <Icon name="cart" size={16} /> Toko
        </button>
        <button className={inAdmin ? "on" : ""} onClick={() => go(authed ? "dashboard" : "dashboard", {}, "admin")}>
          <Icon name="grid" size={16} /> Admin
        </button>
      </div>

      <Toast toast={toast} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
