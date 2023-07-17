import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const QuioscoCostext = createContext();

const QuioscoProvider = ({ children }) => {
  //useStates

  const [categorias, setCategorias] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState({});
  const [producto, setProducto] = useState({});
  const [modal, setModal] = useState(false);
  const [pedido, setPedido] = useState([]);
  const [nombre, setNombre] = useState("");
  const [total, setTotal] = useState(0);

  // COnsults

  const router = useRouter();

  const obtenerCategorias = async () => {
    const { data } = await axios("/api/categorias");
    setCategorias(data);
  };

  //useEfects

  useEffect(() => {
    obtenerCategorias();
  }, []);
  useEffect(() => {
    setCategoriaActual(categorias[0]);
  }, [categorias]);
  useEffect(() => {
    const nuevoTotal = pedido.reduce(
      (total, producto) => producto.precio * producto.cantidad + total,
      0
    );
    setTotal(nuevoTotal);
  }, [pedido]);

  // Fuctions

  const handleClickCategoria = (id) => {
    const categoria = categorias.filter((cat) => cat.id === id);
    setCategoriaActual(categoria[0]);
    router.push("/");
  };

  const handleSetProducto = (producto) => {
    setProducto(producto);
  };

  const handleChangeModal = () => {
    setModal(!modal);
  };

  const handleAgregarPedido = ({ categoriaId, ...producto }) => {
    if (pedido.some((productoState) => productoState.id === producto.id)) {
      //Actualizar cantidad del pedido

      const pedidoActual = pedido.map((productoState) =>
        productoState.id === producto.id ? producto : productoState
      );
      setPedido(pedidoActual);
      toast.success("Modificación Realizada 📨");
    } else {
      //Agregar al carrito un nuevo producto
      setPedido([...pedido, producto]);
      toast.success("Agregado al Pedido 📤");
    }
    setModal(false);
  };

  const handleEditarCantidades = (id) => {
    const productoActualizar = pedido.filter((producto) => producto.id === id);
    setProducto(productoActualizar[0]);
    setModal(!modal);
  };

  const handleEliminarProducto = (id) => {
    const pedidoActualizado = pedido.filter((producto) => producto.id !== id);
    setPedido(pedidoActualizado);
  };

  const colocarOrden = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/ordenes", {
        pedido,
        nombre,
        total,
        fecha: Date.now().toString(),
      });

      //Reset the app
      setCategoriaActual(categorias[0])
      setPedido([])
      setNombre("")
      setTotal(0)

      toast.success('Pedido Realizado con Exito')

      setTimeout(() => {
        router.push('/')
      }, 1500)

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <QuioscoCostext.Provider
      value={{
        categorias,
        categoriaActual,
        handleClickCategoria,
        producto,
        handleSetProducto,
        modal,
        handleChangeModal,
        handleAgregarPedido,
        pedido,
        handleEditarCantidades,
        handleEliminarProducto,
        nombre,
        setNombre,
        total,
        colocarOrden,
      }}
    >
      {children}
    </QuioscoCostext.Provider>
  );
};

export { QuioscoProvider };

export default QuioscoCostext;
