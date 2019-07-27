class Heap {
    constructor() 
    {
        this.m_data = [];
    }
    
    Add(addItem) 
    {
        this.m_data.push(addItem);
        this.m_data[-1].index = this.m_data.length - 1;
        this.PutUp(this.m_data.length);
    }

    PutUp(index) 
    {
        while (index / 2 > 0 && this.m_data[index].compare(this.m_data[index / 2])) {
            swap(this.m_data[index], this.m_data[index / 2]);
            index = index / 2;
        }
        
    }

    PutDown(index) 
    {
        while (true) 
        {
            var indexComp = index * 2;
            if (indexComp > this.m_data.length) 
            {
                break;
            }
            if (indexComp + 1 < this.m_data.length && this.m_data[indexComp + 1].compare(this.m_data[indexComp])) 
            {
                indexComp++;
            }
            if (this.m_data[indexComp].compare(this.m_data[index])) 
            {
                swap(this.m_data[index], this.m_data[indexComp]);
                index = indexComp;
            } else 
            {
                break;
            }

        }
    }

    Pop() 
    {
        var result = this.m_data[0];
        this.Remove(0);
        return result;
    }

    Top() 
    {
        return this.m_data[0];
    }

    Update(index) 
    {
        this.PutUp(index);
        this.PutDown(index);
    }

    Remove(index) {
        swap(this.m_data[index], this.m_data[-1]);
        this.m_data.pop();
        this.PutUp(index);
        this.PutDown(index);
    }
}